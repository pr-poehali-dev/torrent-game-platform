import json
import os
import re
import urllib.request
import urllib.parse
import psycopg2
from typing import Dict, Any, Optional

def extract_app_id(url: str) -> Optional[str]:
    """Extract Steam App ID from URL"""
    patterns = [
        r'store\.steampowered\.com/app/(\d+)',
        r'steamcommunity\.com/app/(\d+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    if url.isdigit():
        return url
    
    return None


def fetch_steam_data(app_id: str) -> Dict[str, Any]:
    """Fetch game data from Steam API"""
    api_url = f'https://store.steampowered.com/api/appdetails?appids={app_id}&l=russian'
    
    req = urllib.request.Request(
        api_url,
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    with urllib.request.urlopen(req, timeout=10) as response:
        data = json.loads(response.read().decode('utf-8'))
    
    if app_id not in data or not data[app_id].get('success'):
        raise ValueError('Game not found or data unavailable')
    
    game_data = data[app_id]['data']
    
    screenshots = []
    if 'screenshots' in game_data:
        screenshots = [s['path_full'] for s in game_data['screenshots'][:5]]
    
    result = {
        'name': game_data.get('name', ''),
        'description': game_data.get('short_description', ''),
        'fullDescription': game_data.get('detailed_description', ''),
        'headerImage': game_data.get('header_image', ''),
        'screenshots': screenshots,
        'releaseDate': game_data.get('release_date', {}).get('date', ''),
        'developers': game_data.get('developers', []),
        'publishers': game_data.get('publishers', []),
        'genres': [g['description'] for g in game_data.get('genres', [])],
        'isFree': game_data.get('is_free', False),
        'appId': app_id,
        'steamUrl': f'https://store.steampowered.com/app/{app_id}'
    }
    
    if 'price_overview' in game_data:
        price = game_data['price_overview']
        result['price'] = {
            'currency': price.get('currency', 'RUB'),
            'initial': price.get('initial', 0) / 100,
            'final': price.get('final', 0) / 100,
            'discount': price.get('discount_percent', 0)
        }
    
    return result


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления торрентами, статистикой и парсинга данных из Steam
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - object с request_id, function_name
    Returns: HTTP response dict с данными торрентов, статистикой или данными из Steam
    '''
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    path_params = event.get('pathParams', {}) or {}
    url = event.get('url', '')
    
    action = query_params.get('action', '')
    
    if not action and url:
        path_parts = url.strip('/').split('/')
        if len(path_parts) > 0:
            action = path_parts[-1]
    
    print(f"DEBUG: method={method}, action={action}, query_params={query_params}, url={url}, path_params={path_params}")
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if action == 'steam' and method == 'GET':
        url_or_id = query_params.get('url') or query_params.get('appId')
        
        if not url_or_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing url or appId parameter'})
            }
        
        app_id = extract_app_id(url_or_id)
        
        if not app_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid Steam URL or App ID'})
            }
        
        try:
            game_data = fetch_steam_data(app_id)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(game_data, ensure_ascii=False)
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Failed to fetch Steam data: {str(e)}'})
            }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    try:
        if action == 'categories' and method == 'GET':
            cur.execute("SELECT id, name, slug FROM t_p88186320_torrent_game_platfor.categories ORDER BY name")
            rows = cur.fetchall()
            categories = []
            for row in rows:
                cur.execute("SELECT COUNT(*) FROM t_p88186320_torrent_game_platfor.torrents WHERE %s = ANY(category)", (row[2],))
                count = cur.fetchone()[0]
                categories.append({
                    'id': row[0],
                    'name': row[1],
                    'slug': row[2],
                    'count': count
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'categories': categories})
            }
        
        elif action == 'categories' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name')
            slug = body_data.get('slug')
            
            cur.execute(
                "INSERT INTO t_p88186320_torrent_game_platfor.categories (name, slug) VALUES (%s, %s) RETURNING id",
                (name, slug)
            )
            category_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'id': category_id, 'message': 'Категория добавлена'})
            }
        
        elif action == 'categories' and method == 'DELETE':
            category_id = query_params.get('id')
            if category_id:
                cur.execute("DELETE FROM t_p88186320_torrent_game_platfor.categories WHERE id = %s", (category_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Категория удалена'})
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing id parameter'})
                }
        
        elif action == 'stats' and method == 'GET':
            cur.execute("SELECT COUNT(*) FROM t_p88186320_torrent_game_platfor.torrents")
            games_count = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM t_p88186320_torrent_game_platfor.users")
            users_count = cur.fetchone()[0]
            
            stats = {
                'games': games_count,
                'users': users_count,
                'comments': 0
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(stats)
            }
        
        elif action.startswith('users/') and method == 'DELETE':
            user_id = action.split('/')[-1]
            cur.execute("DELETE FROM t_p88186320_torrent_game_platfor.users WHERE id = %s", (user_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'Пользователь удален'})
            }
        
        elif action == 'users' and method == 'GET':
            cur.execute("SELECT id, username, created_at FROM t_p88186320_torrent_game_platfor.users ORDER BY created_at DESC")
            rows = cur.fetchall()
            users = []
            for row in rows:
                users.append({
                    'id': row[0],
                    'username': row[1],
                    'email': '',
                    'created_at': row[2].isoformat() if row[2] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'users': users})
            }
        
        elif method == 'DELETE':
            torrent_id = query_params.get('id') or action
            if not torrent_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing id parameter'})
                }
            
            cur.execute("DELETE FROM t_p88186320_torrent_game_platfor.torrents WHERE id = %s", (torrent_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'Торрент удален'})
            }
        
        elif action and method == 'PUT':
            torrent_id = action
            body_data = json.loads(event.get('body', '{}'))
            
            print(f"PUT DEBUG: torrent_id={torrent_id}, body_data={body_data}")
            
            title = body_data.get('title')
            poster = body_data.get('poster')
            downloads = int(body_data.get('downloads', 0))
            size = float(body_data.get('size'))
            categories = body_data.get('categories', [])
            description = body_data.get('description', '')
            steam_deck = body_data.get('steamDeck', False)
            
            print(f"PUT VALUES: title={title}, steam_deck={steam_deck}, categories={categories}")
            
            cur.execute(
                "UPDATE t_p88186320_torrent_game_platfor.torrents SET title = %s, poster = %s, downloads = %s, size = %s, category = %s, description = %s, steam_deck = %s WHERE id = %s",
                (title, poster, downloads, size, categories, description, steam_deck, torrent_id)
            )
            conn.commit()
            
            print(f"PUT SUCCESS: updated torrent {torrent_id}")
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'Торрент обновлен'})
            }
        
        elif method == 'GET':
            category = event.get('queryStringParameters', {}).get('category') if event.get('queryStringParameters') else None
            
            if category:
                cur.execute(
                    "SELECT id, title, poster, downloads, size, category, description, steam_deck FROM t_p88186320_torrent_game_platfor.torrents WHERE %s = ANY(category) ORDER BY downloads DESC",
                    (category,)
                )
            else:
                cur.execute(
                    "SELECT id, title, poster, downloads, size, category, description, steam_deck FROM t_p88186320_torrent_game_platfor.torrents ORDER BY downloads DESC"
                )
            
            rows = cur.fetchall()
            torrents = []
            for row in rows:
                torrents.append({
                    'id': row[0],
                    'title': row[1],
                    'poster': row[2],
                    'downloads': row[3],
                    'size': float(row[4]),
                    'category': row[5],
                    'description': row[6],
                    'steamDeck': bool(row[7])
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'torrents': torrents})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            title = body_data.get('title')
            poster = body_data.get('poster')
            downloads = int(body_data.get('downloads', 0))
            size = float(body_data.get('size'))
            categories = body_data.get('categories', [])
            description = body_data.get('description', '')
            steam_deck = body_data.get('steamDeck', False)
            
            cur.execute(
                "INSERT INTO t_p88186320_torrent_game_platfor.torrents (title, poster, downloads, size, category, description, steam_deck) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (title, poster, downloads, size, categories, description, steam_deck)
            )
            torrent_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'id': torrent_id,
                    'message': 'Торрент успешно добавлен'
                })
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
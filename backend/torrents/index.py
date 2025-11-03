import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления торрентами и статистикой (получение списка, добавление, статистика)
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - object с request_id, function_name
    Returns: HTTP response dict с данными торрентов или статистикой
    '''
    method: str = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    query_params = event.get('queryStringParameters', {}) or {}
    action = path_params.get('proxy', '')
    
    url = event.get('url', '')
    if url:
        url_parts = url.strip('/').split('/')
        if len(url_parts) > 0 and url_parts[-1] and url_parts[-1] not in ['stats', 'users']:
            action = url_parts[-1]
    
    print(f"DEBUG: method={method}, action={action}, url={url}, query_params={query_params}")
    
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
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    try:
        if action == 'stats' and method == 'GET':
            cur.execute("SELECT COUNT(*) FROM torrents")
            games_count = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM users")
            users_count = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM comments")
            comments_count = cur.fetchone()[0]
            
            stats = {
                'games': games_count,
                'users': users_count,
                'comments': comments_count
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
            cur.execute("DELETE FROM comments WHERE user_id = %s", (user_id,))
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
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
            cur.execute("SELECT id, username, email, created_at FROM users ORDER BY created_at DESC")
            rows = cur.fetchall()
            users = []
            for row in rows:
                users.append({
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'created_at': row[3].isoformat() if row[3] else None
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
            
            cur.execute("DELETE FROM torrents WHERE id = %s", (torrent_id,))
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
            
            title = body_data.get('title')
            poster = body_data.get('poster')
            downloads = int(body_data.get('downloads', 0))
            size = float(body_data.get('size'))
            category = body_data.get('category')
            description = body_data.get('description', '')
            
            cur.execute(
                "UPDATE torrents SET title = %s, poster = %s, downloads = %s, size = %s, category = %s, description = %s WHERE id = %s",
                (title, poster, downloads, size, category, description, torrent_id)
            )
            conn.commit()
            
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
                    "SELECT id, title, poster, downloads, size, category, description FROM torrents WHERE category = %s ORDER BY downloads DESC",
                    (category,)
                )
            else:
                cur.execute(
                    "SELECT id, title, poster, downloads, size, category, description FROM torrents ORDER BY downloads DESC"
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
                    'description': row[6]
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
            category = body_data.get('category')
            description = body_data.get('description', '')
            
            cur.execute(
                "INSERT INTO torrents (title, poster, downloads, size, category, description) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (title, poster, downloads, size, category, description)
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
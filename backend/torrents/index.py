import json
import os
import re
import urllib.request
import urllib.parse
import hashlib
from typing import Dict, Any, Optional
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase (will be done in handler)

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

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
    
    steam_rating = None
    steam_rating_percent = None
    if 'recommendations' in game_data:
        steam_rating = game_data['recommendations'].get('total', 0)
    
    metacritic_score = None
    if 'metacritic' in game_data:
        metacritic_score = game_data['metacritic'].get('score', None)
    
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
        'steamUrl': f'https://store.steampowered.com/app/{app_id}',
        'steamRating': steam_rating,
        'metacriticScore': metacritic_score
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
    Business: API для управления торрентами через Firebase Firestore
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - object с request_id, function_name
    Returns: HTTP response dict с данными торрентов, статистикой или данными из Steam
    '''
    # Initialize Firebase
    cred_json = os.environ.get('FIREBASE_CREDENTIALS', '')
    
    if not firebase_admin._apps:
        if not cred_json or cred_json.strip() == '':
            return {
                'statusCode': 503,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'error': 'Firebase credentials not configured. Please add FIREBASE_CREDENTIALS secret.',
                    'hint': 'Add the JSON service account key from Firebase Console'
                })
            }
        try:
            cred_dict = json.loads(cred_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        except json.JSONDecodeError as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'error': 'Invalid Firebase credentials JSON format',
                    'details': str(e)
                })
            }
    
    db = firestore.client()
    
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
                'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-Requested-With',
                'Access-Control-Max-Age': '86400',
                'Content-Type': 'text/plain'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if action == 'migrate' and method == 'POST':
        try:
            # Data from PostgreSQL
            categories_data = [
                {'name': 'RPG', 'slug': 'RPG', 'icon': 'Sword'},
                {'name': 'Экшен', 'slug': 'Action', 'icon': 'Zap'},
                {'name': 'Гонки', 'slug': 'Racing', 'icon': 'Car'}
            ]
            
            users_data = [
                {
                    'username': 'Kot',
                    'email': 'igorkochetkow@yandex.ru',
                    'password_hash': '497c0f6767166ad2242e9266d9ce34409ac43cd2a9e22b548aa7b1a6329a68d7',
                    'avatar': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kot',
                    'first_name': 'Kot',
                    'created_at': '2025-11-05T16:27:55.463905',
                    'is_admin': False
                }
            ]
            
            torrents_data = [
                {
                    'title': 'Counter-Strike 2',
                    'poster': 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_0f8cf82d019c614760fd20801f2bb4001da7ea77.1920x1080.jpg?t=1749053861',
                    'downloads': 0,
                    'size': 16.0,
                    'category': ['action', 'RPG'],
                    'description': 'Более двух десятилетий Counter-Strike служит примером первоклассной соревновательной игры, путь развития которой определяют миллионы игроков со всего мира. Теперь пришло время нового этапа — Counter-Strike 2.',
                    'steam_deck': True,
                    'steam_rating': 4755307,
                    'metacritic_score': None
                }
            ]
            
            results = {
                'categories': [],
                'users': [],
                'torrents': []
            }
            
            # Migrate categories
            for cat in categories_data:
                doc_ref = db.collection('categories').add(cat)
                results['categories'].append({'name': cat['name'], 'id': doc_ref[1].id})
            
            # Migrate users
            for user in users_data:
                doc_ref = db.collection('users').add(user)
                results['users'].append({'username': user['username'], 'id': doc_ref[1].id})
            
            # Migrate torrents
            for torrent in torrents_data:
                doc_ref = db.collection('torrents').add(torrent)
                results['torrents'].append({'title': torrent['title'], 'id': doc_ref[1].id})
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Миграция завершена успешно',
                    'migrated': {
                        'categories': len(results['categories']),
                        'users': len(results['users']),
                        'torrents': len(results['torrents'])
                    },
                    'details': results
                }, ensure_ascii=False)
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Ошибка миграции: {str(e)}'})
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
                'isBase64Encoded': False,
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
                'isBase64Encoded': False,
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
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Failed to fetch Steam data: {str(e)}'})
            }
    
    try:
        if action == 'auth' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            auth_action = body_data.get('action', 'login')
            
            if auth_action == 'register':
                username = body_data.get('username', '').strip()
                email = body_data.get('email', '').strip()
                password = body_data.get('password', '')
                
                if not username or not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Все поля обязательны для заполнения'})
                    }
                
                users_ref = db.collection('users')
                existing_email = users_ref.where('email', '==', email).limit(1).get()
                existing_username = users_ref.where('username', '==', username).limit(1).get()
                
                if len(list(existing_email)) > 0 or len(list(existing_username)) > 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Пользователь с таким email или username уже существует'})
                    }
                
                password_hash = hash_password(password)
                avatar = f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}"
                
                user_data = {
                    'username': username,
                    'email': email,
                    'password_hash': password_hash,
                    'avatar': avatar,
                    'first_name': username,
                    'created_at': datetime.utcnow().isoformat(),
                    'is_admin': False
                }
                
                doc_ref = users_ref.add(user_data)
                user_id = doc_ref[1].id
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'user': {
                            'id': user_id,
                            'username': username,
                            'email': email,
                            'avatar': avatar,
                            'first_name': username,
                            'created_at': user_data['created_at'],
                            'is_admin': False
                        },
                        'token': f"user_{user_id}"
                    })
                }
            
            elif auth_action == 'login':
                email = body_data.get('email', '').strip()
                password = body_data.get('password', '')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Email и пароль обязательны'})
                    }
                
                password_hash = hash_password(password)
                
                users_ref = db.collection('users')
                users_query = users_ref.where('email', '==', email).where('password_hash', '==', password_hash).limit(1).get()
                
                users_list = list(users_query)
                
                if len(users_list) == 0:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Неверный email или пароль'})
                    }
                
                user_doc = users_list[0]
                user_data = user_doc.to_dict()
                user_id = user_doc.id
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'user': {
                            'id': user_id,
                            'username': user_data.get('username'),
                            'email': user_data.get('email'),
                            'avatar': user_data.get('avatar'),
                            'first_name': user_data.get('first_name'),
                            'created_at': user_data.get('created_at'),
                            'is_admin': user_data.get('is_admin', False)
                        },
                        'token': f"user_{user_id}"
                    })
                }
        
        elif action == 'users' and method == 'GET':
            users_ref = db.collection('users').order_by('created_at', direction=firestore.Query.DESCENDING)
            users_docs = users_ref.stream()
            
            users = []
            for doc in users_docs:
                user_data = doc.to_dict()
                users.append({
                    'id': doc.id,
                    'username': user_data.get('username'),
                    'email': user_data.get('email'),
                    'avatar': user_data.get('avatar'),
                    'first_name': user_data.get('first_name'),
                    'created_at': user_data.get('created_at'),
                    'is_admin': user_data.get('is_admin', False)
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'users': users})
            }
        
        elif action == 'users' and method == 'PUT':
            user_id = query_params.get('id')
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'User ID is required'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            is_admin = body_data.get('is_admin', False)
            
            db.collection('users').document(user_id).update({'is_admin': is_admin})
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'User updated successfully'})
            }
        
        elif action == 'categories' and method == 'GET':
            categories_ref = db.collection('categories').order_by('name')
            categories_docs = categories_ref.stream()
            
            categories = []
            for doc in categories_docs:
                cat_data = doc.to_dict()
                
                torrents_ref = db.collection('torrents').where('category', 'array_contains', cat_data.get('slug')).stream()
                count = len(list(torrents_ref))
                
                categories.append({
                    'id': doc.id,
                    'name': cat_data.get('name'),
                    'slug': cat_data.get('slug'),
                    'icon': cat_data.get('icon', 'Gamepad2'),
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
            icon = body_data.get('icon', 'Gamepad2')
            
            doc_ref = db.collection('categories').add({
                'name': name,
                'slug': slug,
                'icon': icon
            })
            category_id = doc_ref[1].id
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'id': category_id, 'message': 'Категория добавлена'})
            }
        
        elif action == 'categories' and method == 'PUT':
            category_id = query_params.get('id')
            if category_id:
                body_data = json.loads(event.get('body', '{}'))
                name = body_data.get('name')
                slug = body_data.get('slug')
                icon = body_data.get('icon', 'Gamepad2')
                
                db.collection('categories').document(category_id).update({
                    'name': name,
                    'slug': slug,
                    'icon': icon
                })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Категория обновлена'})
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
        
        elif action == 'categories' and method == 'DELETE':
            category_id = query_params.get('id')
            if category_id:
                db.collection('categories').document(category_id).delete()
                
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
            torrents_ref = db.collection('torrents').stream()
            games_count = len(list(torrents_ref))
            
            users_ref = db.collection('users').stream()
            users_count = len(list(users_ref))
            
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
            db.collection('users').document(user_id).delete()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'Пользователь удален'})
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
            
            db.collection('torrents').document(torrent_id).delete()
            
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
            steam_rating = body_data.get('steamRating')
            metacritic_score = body_data.get('metacriticScore')
            
            print(f"PUT VALUES: title={title}, steam_deck={steam_deck}, categories={categories}")
            
            db.collection('torrents').document(torrent_id).update({
                'title': title,
                'poster': poster,
                'downloads': downloads,
                'size': size,
                'category': categories,
                'description': description,
                'steam_deck': steam_deck,
                'steam_rating': steam_rating,
                'metacritic_score': metacritic_score
            })
            
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
                torrents_ref = db.collection('torrents').where('category', 'array_contains', category).order_by('downloads', direction=firestore.Query.DESCENDING)
            else:
                torrents_ref = db.collection('torrents').order_by('downloads', direction=firestore.Query.DESCENDING)
            
            torrents_docs = torrents_ref.stream()
            
            torrents = []
            for doc in torrents_docs:
                torrent_data = doc.to_dict()
                torrents.append({
                    'id': doc.id,
                    'title': torrent_data.get('title'),
                    'poster': torrent_data.get('poster'),
                    'downloads': torrent_data.get('downloads', 0),
                    'size': float(torrent_data.get('size', 0)),
                    'category': torrent_data.get('category', []),
                    'description': torrent_data.get('description', ''),
                    'steamDeck': bool(torrent_data.get('steam_deck', False)),
                    'steamRating': torrent_data.get('steam_rating'),
                    'metacriticScore': torrent_data.get('metacritic_score')
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
            steam_rating = body_data.get('steamRating')
            metacritic_score = body_data.get('metacriticScore')
            
            doc_ref = db.collection('torrents').add({
                'title': title,
                'poster': poster,
                'downloads': downloads,
                'size': size,
                'category': categories,
                'description': description,
                'steam_deck': steam_deck,
                'steam_rating': steam_rating,
                'metacritic_score': metacritic_score
            })
            torrent_id = doc_ref[1].id
            
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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Internal server error: {str(e)}'})
        }
'''
Business: Parse Steam game data by URL or App ID
Args: event with httpMethod, queryStringParameters (url or appId)
Returns: Game data (name, description, images, price, etc.)
'''

import json
import re
import urllib.request
import urllib.parse
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
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters') or {}
    url_or_id = params.get('url') or params.get('appId')
    
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

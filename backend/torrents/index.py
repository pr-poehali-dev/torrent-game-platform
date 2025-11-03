import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления торрентами (получение списка и добавление)
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с request_id, function_name
    Returns: HTTP response dict с списком торрентов или результатом добавления
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
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

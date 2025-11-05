"""
Script to migrate data from PostgreSQL to Firebase Firestore
Run this once to transfer all existing data
"""
import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred_json = os.environ.get('FIREBASE_CREDENTIALS')
if cred_json:
    cred_dict = json.loads(cred_json)
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)

db = firestore.client()

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

def migrate():
    print("Starting migration to Firebase Firestore...")
    
    # Migrate categories
    print(f"\nMigrating {len(categories_data)} categories...")
    for cat in categories_data:
        doc_ref = db.collection('categories').add(cat)
        print(f"  ✓ Added category: {cat['name']} (ID: {doc_ref[1].id})")
    
    # Migrate users
    print(f"\nMigrating {len(users_data)} users...")
    for user in users_data:
        doc_ref = db.collection('users').add(user)
        print(f"  ✓ Added user: {user['username']} (ID: {doc_ref[1].id})")
    
    # Migrate torrents
    print(f"\nMigrating {len(torrents_data)} torrents...")
    for torrent in torrents_data:
        doc_ref = db.collection('torrents').add(torrent)
        print(f"  ✓ Added torrent: {torrent['title']} (ID: {doc_ref[1].id})")
    
    print("\n✅ Migration completed successfully!")
    print("\nCollections created:")
    print(f"  - categories: {len(categories_data)} documents")
    print(f"  - users: {len(users_data)} documents")
    print(f"  - torrents: {len(torrents_data)} documents")

if __name__ == '__main__':
    migrate()

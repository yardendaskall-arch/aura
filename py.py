from flask import Flask, send_from_directory, jsonify, request
import sqlite3
import os

app = Flask(__name__)
DB_FILE = 'projects.db'

# Initialize the database
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            image_url TEXT NOT NULL
        )
    ''')
    
    # Check if empty, insert dummy data
    c.execute('SELECT COUNT(*) FROM projects')
    if c.fetchone()[0] == 0:
        c.executemany('''
            INSERT INTO projects (title, description, image_url)
            VALUES (?, ?, ?)
        ''', [
            ("Nexus Platform", "A next-gen SaaS dashboard.", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"),
            ("Echo E-Commerce", "High-conversion storefront.", "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"),
            ("Nova Identity", "Global brand platform.", "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")
        ])
    
    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# API endpoint to get all projects
@app.route('/api/projects', methods=['GET'])
def get_projects():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM projects')
    
    projects = []
    for row in c.fetchall():
        projects.append({
            'id': row['id'],
            'title': row['title'],
            'description': row['description'],
            'image_url': row['image_url']
        })
    conn.close()
    
    return jsonify(projects)

# API endpoint to add a new project
@app.route('/api/projects', methods=['POST'])
def add_project():
    data = request.json
    
    if not data or not data.get('title') or not data.get('description') or not data.get('image_url'):
        return jsonify({'error': 'Missing required fields (title, description, image_url)'}), 400
        
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        INSERT INTO projects (title, description, image_url)
        VALUES (?, ?, ?)
    ''', (data['title'], data['description'], data['image_url']))
    
    new_id = c.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': new_id,
        'title': data['title'],
        'description': data['description'],
        'image_url': data['image_url']
    }), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)

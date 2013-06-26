import os
from flask import (
Flask,
request,
render_template
) 
from rq import Queue
from worker import conn
from poster import make_poster

app = Flask(__name__)
q = Queue(connection=conn)   

@app.route('/Poster')
def poster_page():
    return render_template('poster.html')

@app.route('/')
@app.route('/Chat', methods=["GET", "POST"])
@app.route('/<page>')
def chat_page(page="Chat"):
    if request.method == 'POST':
        res = q.enqueue(make_poster, request.form['term'])
    return render_template('chat.html', pagename=page, is_post=(request.method == 'POST'))


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

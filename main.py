import os
from flask import Flask

app = Flask(__name__)


@app.route('/')
@app.route('/poster')
def poster():
    return 'Hello Poster!'


@app.route('/chat')
def chat():
    return 'Hello Chat!'


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

from flask import Flask


def create_app():
    app = Flask(__name__)
    app.secret_key = '09619472778ffaeb028f86633fea2f45'

    from . import Flask_App
    app.register_blueprint(Flask_App.bp)

    return app


import logging
from flask import jsonify, request
import flask_login

from server import app, auth
from server.util.request import form_fields_required, json_error_response

logger = logging.getLogger(__name__)

@app.route('/api/login', methods=['POST'])
@form_fields_required('email', 'password')
def login_with_password():
    username = request.form["email"]
    logger.debug("login request from %s", username)
    password = request.form["password"]
    user = auth.authenticate_by_password(username, password)
    if user.is_anonymous:   # login failed
        logger.debug("  login failed (%s)", user.is_anonymous)
        return json_error_response("login failed", 401)
    auth.login_user(user)
    response = {'email':username, 'key':user.get_id()}
    return jsonify(response)

@app.route('/api/login-with-key', methods=['POST'])
@form_fields_required('email', 'key')
def login_with_key():
    username = request.form["email"]
    logger.debug("login request from %s", username)
    key = request.form["key"]
    user = auth.authenticate_by_key(username, key)
    if user.is_anonymous:   # login failed
        logger.debug("  login failed (%s)", user.is_anonymous)
        return json_error_response("login failed", 401)
    auth.login_user(user)
    response = {'email':username, 'key':user.get_id()}
    return jsonify(response)

# TODO: put in real API method once it is ready
@app.route('/api/permissions/user/list', methods=['GET'])
@flask_login.login_required
def permissions_for_user():
    return jsonify({
        "permissions":
            [
                {
                    "email": "hroberts@cyber.law.harvard.edu",
                    "topics_id": 1390,
                    "permission": "admin"
                }
            ]
        })
# -*- coding: utf-8 -*-
'''Public section, including homepage and signup.'''
from flask import (Blueprint, request, render_template, flash, url_for,
                    redirect, session, jsonify, redirect, request, current_app)
from flask.ext.login import login_user, login_required, logout_user

from translatorsdesk.extensions import login_manager
from translatorsdesk.user.models import User
from translatorsdesk.public.forms import LoginForm
from translatorsdesk.user.forms import RegisterForm
from translatorsdesk.utils import flash_errors
from translatorsdesk.database import db

import datetime, uuid, os

blueprint = Blueprint('public', __name__, static_folder="../static")

@login_manager.user_loader
def load_user(id):
    return User.get_by_id(int(id))


@blueprint.route("/", methods=["GET", "POST"])
def home():
    form = LoginForm(request.form)
    # Handle logging in
    if request.method == 'POST':
        if form.validate_on_submit():
            login_user(form.user)
            flash("You are logged in.", 'success')
            redirect_url = request.args.get("next") or url_for("user.members")
            return redirect(redirect_url)
        else:
            flash_errors(form)
    return render_template("public/home.html", form=form)

@blueprint.route('/logout/')
@login_required
def logout():
    logout_user()
    flash('You are logged out.', 'info')
    return redirect(url_for('public.home'))

@blueprint.route("/register/", methods=['GET', 'POST'])
def register():
    form = RegisterForm(request.form, csrf_enabled=False)
    if form.validate_on_submit():
        new_user = User.create(username=form.username.data,
                        email=form.email.data,
                        password=form.password.data,
                        active=True)
        flash("Thank you for registering. You can now log in.", 'success')
        return redirect(url_for('public.home'))
    else:
        flash_errors(form)
    return render_template('public/register.html', form=form)

@blueprint.route("/about/")
def about():
    form = LoginForm(request.form)
    return render_template("public/about.html", form=form)

"""
    Handles file uploads
"""
@blueprint.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            if _allowed_file(file.filename):
                _uuid = str(uuid.uuid4())
                secure_filename = file.filename.replace('/', "_").replace('\\', '_')
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'],  _uuid, secure_filename)
                
                if not os.path.exists(os.path.dirname(filepath)):
                    os.makedirs(os.path.dirname(filepath))
                file.save(filepath)

                return jsonify({"success":True, "filename":file.filename, "uuid": _uuid })
            else:
                return jsonify({"success": False, "message": "File Type not supported yet!!"})
        else:
            return jsonify({"success": False, "message": "Corrupt File :( "})


def _allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in current_app.config['ALLOWED_FILE_EXTENSIONS']

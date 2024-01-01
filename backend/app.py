import os

from flask import Flask, request
from traceback import format_exc
from werkzeug import utils, datastructures
from flask_restful import reqparse, abort, Api, Resource

from s3_util import S3Manager


app = Flask(__name__)
api = Api(app)
s3_manager = S3Manager()


def abort_if_todo_doesnt_exist(todo_id):
    if todo_id not in []:
        abort(404, message="Todo {} doesn't exist".format(todo_id))

s3_connection_parser = reqparse.RequestParser()
s3_connection_parser.add_argument('bucket_name', required=True, help="Name cannot be blank!")
s3_connection_parser.add_argument('aws_access_key_id', required=True, help="Name cannot be blank!")
s3_connection_parser.add_argument('aws_secret_access_key', required=True, help="Name cannot be blank!")
s3_list_parser = reqparse.RequestParser()
s3_list_parser.add_argument('bucket_name', required=True, help="Name cannot be blank!")
s3_list_parser.add_argument('prefix', required=True, help="Name cannot be blank!")
s3_download_parser = reqparse.RequestParser()
s3_download_parser.add_argument('bucket_name', required=True, help="Name cannot be blank!")
s3_download_parser.add_argument('object_name', required=True, help="Name cannot be blank!")
s3_upload_parser = reqparse.RequestParser()
s3_upload_parser.add_argument(
    'file_to_upload',
    required=True,
    # help="Name cannot be blank!",
    type=datastructures.FileStorage,
    location='files'
    )
s3_upload_parser.add_argument(
    'bucket_name',
    required=True,
    location='form')
s3_upload_parser.add_argument(
    'upload_path',
    required=True,
    location='form')

# TodoList
# shows a list of all todos, and lets you POST to add new tasks
class S3Connection(Resource):
    def get(self):
        return {"hello": "world"}, 200

    def post(self):
        args = s3_connection_parser.parse_args()
        s3_manager.get_client_s3(**args)
        return {"data": args}, 200

class S3List(Resource):
    def post(self):
        args = s3_list_parser.parse_args()
        response = s3_manager.list_paths_s3(**args)
        return {"data": response}, 200

class S3Download(Resource):
    def post(self):
        args = s3_download_parser.parse_args()
        response = s3_manager.create_presigned_url(**args)
        return {"data": response}, 200


class s3FileUpload(Resource):
    def post(self):
        # file = request.files["file"]
        # filename = secure_filename(file.filename)
        # file.save(filename)

        args = s3_upload_parser.parse_args()
        filename = utils.secure_filename(args['file_to_upload'].filename)
        args['file_to_upload'].save(filename)
        bucket_name = args['bucket_name']
        upload_path = args['upload_path']
        s3_manager.upload_file_s3(
            bucket_name,
            filename,
            upload_path
        )
        os.remove(filename)
        return {"data": 'Success'}, 200

##
## Actually setup the Api resource routing here
##
api.add_resource(S3Connection, '/api/s3/connect')
api.add_resource(S3List, '/api/s3/list')
api.add_resource(S3Download, '/api/s3/download')
api.add_resource(s3FileUpload, '/api/s3/upload')


if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000, host='0.0.0.0')

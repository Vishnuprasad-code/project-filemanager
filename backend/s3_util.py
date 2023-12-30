import boto3
from botocore.client import Config
from botocore.exceptions import ClientError


class S3Manager():
    def __init__(self, s3_client=None):
        self.s3_client = s3_client
    
    def get_client_s3(
        self,
        aws_access_key_id,
        aws_secret_access_key,
        bucket_name=None,
        region_name='us-east-1',
        config='s3v4'
    ):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name,
            config=Config(signature_version=config)
        )
        return self.s3_client

    def list_paths_s3(self, bucket_name, prefix=""):
        folder_name_size_map = {}
        file_paths = []
        
        prefix = prefix.strip()
        if prefix:
            prefix = prefix.strip('/ ') + '/'
        last_directory = prefix.strip('/').split('/')[-1]
        if '.' in last_directory:
            prefix = "/".join(prefix.strip('/').split('/')[:-1])
        response = self.s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        for content_dict in response.get('Contents', []):
#             print(file_paths)
            Key = content_dict.get('Key')
            Size = content_dict.get('Size')
            LastModified = content_dict.get('LastModified')

            newKey = Key.replace(prefix, '')
            # print(newKey)
            if not newKey:
                continue
            elif "/" not in newKey:
                '''not a nested path, direct file'''
                file_paths.append(
                    {
                        'type': "File",
                        'fileName': newKey,
                        'sizeInfo': {'size': Size, 'displaySize': self.format_bytes(Size)},
                        'LastModified': LastModified.strftime('%d-%m-%YT%H:%M:%S')
                    })
                continue

            if newKey.endswith('/') and newKey.count('/') == 1:
                '''not a nested path, direct folder'''
                folder_name_size_map[newKey] = folder_name_size_map.get(newKey) or {}
                folder_name_size_map[newKey]['sizeInfo'] = folder_name_size_map[newKey].get('sizeInfo') or {'size': 0}
                file_paths.append(
                    {
                        'type': "Folder",
                        'fileName': newKey,
                        'sizeInfo': folder_name_size_map[newKey]['sizeInfo'],
                        'LastModified': LastModified.strftime('%d-%m-%YT%H:%M:%S')
                    }
                )
            elif newKey.endswith('/'):
                '''nested path, folder'''
                pass
            else:
                '''nested path, file'''
                folder_name = newKey[: newKey.index("/") + 1]
                need_to_append = False
                if folder_name not in folder_name_size_map:
                    need_to_append = True
                folder_name_size_map[folder_name] = folder_name_size_map.get(folder_name) or {}
                folder_name_size_map[folder_name]['sizeInfo'] = folder_name_size_map[
                    folder_name].get('sizeInfo') or {'size': 0}

                size = folder_name_size_map.get(
                folder_name, {}).get('sizeInfo', {}).get('size', 0) + Size
                folder_name_size_map[
                    folder_name
                ]['sizeInfo']['size'] = size
                folder_name_size_map[
                            folder_name
                        ]['sizeInfo']['displaySize'] = self.format_bytes(size)
                
                if need_to_append:
                    file_paths.append(
                        {
                            'type': "Folder",
                            'fileName': folder_name,
                            'sizeInfo': folder_name_size_map[folder_name]['sizeInfo'],
                            'LastModified': LastModified.strftime('%d-%m-%YT%H:%M:%S')
                        }
                    )

        response = {
            'filePaths': file_paths,
            'prefix': prefix,
        }
        return response

    def create_presigned_url(self, bucket_name, object_name, expiration=30):
        """Generate a presigned URL to share an S3 object

        :param bucket_name: string
        :param object_name: string
        :param expiration: Time in seconds for the presigned URL to remain valid
        :return: Presigned URL as string. If error, returns None.
        """

        # Generate a presigned URL for the S3 object
        response = {
            'url': None,
        }
        try:
            response['url'] = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': bucket_name,
                    'Key': object_name
                },
                ExpiresIn=expiration
            )
        except ClientError:
            response['url'] = None

        return response

    @staticmethod
    def format_bytes(size):
        units = ['B', 'KB', 'MB', 'GB']
        unit_size = 1024
        unit_index = 0

        while size >= unit_size and unit_index < len(units) - 1:
            size /= unit_size
            unit_index += 1

        return f'{size:.2f} {units[unit_index]}'
    
    

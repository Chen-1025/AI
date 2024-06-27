import os
from datetime import datetime


def get_repository_address():
    name = os.path.join('E:\Files\Langchain\db', 'repository-' + str(datetime.now().strftime("%Y%m%d%H%M%S")))
    return name

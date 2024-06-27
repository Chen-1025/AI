import datetime

from django.core.files.storage import default_storage
from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView

from dvadmin.knowledge.models import Knowledge, Repository, RepositoryChunk, ChunkContent
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from dvadmin.utils.json_response import DetailResponse

from dvadmin.knowledge.utils import *


class KnowledgeSerializer(CustomModelSerializer):
    """
    知识库-序列化器
    """

    class Meta:
        model = Knowledge
        fields = "__all__"
        read_only_fields = ["id"]


class KnowledgeViewSet(CustomModelViewSet):
    """
    知识库
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = Knowledge.objects.all()
    serializer_class = KnowledgeSerializer




class RepositorySerializer(CustomModelSerializer):
    """
    知识库-序列化器
    """

    class Meta:
        model = Repository
        fields = "__all__"
        read_only_fields = ["id"]


class RepositoryViewSet(CustomModelViewSet):
    """
    知识库
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer


class RepositoryChunkSerializer(CustomModelSerializer):
    """
    知识库-序列化器
    """

    class Meta:
        model = RepositoryChunk
        fields = "__all__"
        read_only_fields = ["id"]

class RepositoryChunkViewSet(CustomModelViewSet):
    """
    知识库
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = RepositoryChunk.objects.all()
    serializer_class = RepositoryChunkSerializer


class RepositoryCreateView(APIView):

    @transaction.atomic
    def post(self, request):
        name = request.data.get('name')
        description = request.data.get('description')
        chunk_size = request.data.get('chunk_size')
        repeat_size = request.data.get('repeat_size')

        with transaction.atomic():
            try:
                tid = transaction.savepoint()
                address = get_repository_address()
                repository = Repository.objects.create(
                    name=name,
                    description=description,
                    chunk_size=chunk_size,
                    repeat_size=repeat_size,
                    store_address=address
                )

                # embedding = DashScopeEmbeddings()
                # Chroma(persist_directory=repository.story_address, embedding_function=embedding)

                content = {
                    'code': 200,
                    'message': 'success',
                    'data': RepositorySerializer(repository).data,
                }

                return DetailResponse(msg='success', data=content)
            except Exception as e:
                transaction.savepoint_rollback(tid)
                content = {
                    'code': 500,
                    'message': 'error',
                    'data': str(e),
                }
                return Response(content)

class RepositoryUploadView(APIView):

    def post(self, request):
        file = request.FILES.get('file')
        # file_name = file.name
        file_type = file.content_type

        file_path = default_storage.save(os.path.join('uploads/', file.name), file)
        if not file_path:
            return Response({'status': 'error', 'message': 'No file uploaded'}, status=400)

        with open(file.name, 'w', encoding='utf-8') as f:
            for chunk in file.chunks():
                f.write(chunk.decode('utf-8'))


        return DetailResponse(msg='success', data={'file_name': file_path, 'file_type': file_type})


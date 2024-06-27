from django.db import models
from dvadmin.utils.models import CoreModel, table_prefix, get_custom_app_models


# Create your models here.
class Knowledge(CoreModel):
    name = models.CharField(max_length=64, verbose_name="名称", help_text="名称")
    TYPE_CHOICES = (
        (1, "文档知识库"),
        (2, "Excel知识库"),
        (3, "DB知识库"),
    )
    type = models.IntegerField(
        choices=TYPE_CHOICES, default=1, verbose_name="类型", null=True, blank=True, help_text="类型"
    )
    VALID_CHOICES = (
        (0, "无效"),
        (1, "有效"),
    )
    valid = models.IntegerField(
        choices=VALID_CHOICES, default=1, verbose_name="有效", null=True, blank=True, help_text="有效"
    )

    class Meta:
        db_table = table_prefix + "knowledge"
        verbose_name = "知识库表"
        verbose_name_plural = verbose_name
        ordering = ("-update_datetime",)


class Repository(CoreModel):
    name = models.CharField(max_length=200)
    chunk_size = models.IntegerField(default=0)
    repeat_size = models.IntegerField(default=0)
    store_address = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    class Meta:
        db_table = table_prefix + "repository"
        verbose_name = "知识库表"
        verbose_name_plural = verbose_name
        ordering = ("-update_datetime",)


class RepositoryChunk(CoreModel):
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE, related_name='chunks')
    name = models.CharField(max_length=200)
    chunk_count = models.IntegerField(default=0)
    file_name = models.CharField(max_length=200)
    file_type = models.CharField(max_length=200)
    import_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = table_prefix + "repository_chunk"
        verbose_name = "知识库分块表"
        verbose_name_plural = verbose_name


class ChunkContent(CoreModel):
    chunk = models.ForeignKey(RepositoryChunk, on_delete=models.CASCADE, related_name='contents')
    content = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content

    class Meta:
        db_table = table_prefix + "chunk_content"
        verbose_name = "知识库分块表"
        verbose_name_plural = verbose_name

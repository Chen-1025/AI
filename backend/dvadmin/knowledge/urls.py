from django.urls import path
from rest_framework import routers

from dvadmin.knowledge.views import *


knowledge_url = routers.SimpleRouter()

knowledge_url.register(r'knowledge_store', KnowledgeViewSet)
knowledge_url.register(r'repository', RepositoryViewSet)
knowledge_url.register(r'repository/item', RepositoryViewSet)

urlpatterns = [
    path('repository/create/', RepositoryCreateView.as_view()),
    path('repository/upload/', RepositoryUploadView.as_view()),
]

urlpatterns += knowledge_url.urls
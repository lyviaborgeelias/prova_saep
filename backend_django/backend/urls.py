from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import UsuarioViewSet, ProdutoViewSet, MovimentacaoViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'movimentacoes', MovimentacaoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
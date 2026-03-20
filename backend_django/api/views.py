from rest_framework.viewsets import ModelViewSet
from .models import Usuario, Produto, Movimentacao
from .serializers import UsuarioSerializer, ProdutoSerializer, MovimentacaoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ProdutoFilter, MovimentacaoFilter

class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["nome", "login"]

class ProdutoViewSet(ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProdutoFilter

class MovimentacaoViewSet(ModelViewSet):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = MovimentacaoFilter
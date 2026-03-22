from rest_framework.viewsets import ModelViewSet
from .models import Usuario, Produto, Movimentacao
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ProdutoFilter, MovimentacaoFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, action, permission_classes

class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["nome", "login"]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'me':
            return UsuarioMeSerializer
        return super().get_serializer_class()
    
    @action(
        detail=False,
        methods=['get'],
        url_path='me',
        permission_classes=[IsAuthenticated]
    )

    def me(self, request):
        usuario = Usuario.objects.filter(user=request.user).first()
        if not usuario:
            return Response({'detail': "Perfil de usuário não encontrado."}, status=404)
        
        serializer = self.get_serializer(usuario)
        return Response(serializer.data)
    
    @action(
        detail=False,
        methods=['get'],
        url_path='tipo-choices',
        permission_classes=[AllowAny]
    )

    def tipo_choices(self, request):
        return Response([
            {"value": v, "label": l}
            for v, l in Usuario.TIPO_CHOICES
        ])

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
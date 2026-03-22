import django_filters
from .models import Usuario, Produto, Movimentacao

class UsuarioFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(field_name='nome', lookup_expr='icontains')
    login = django_filters.CharFilter(field_name='login', lookup_expr='iexact')

    class Meta:
        model = Usuario
        fields = ['nome', 'login']

class ProdutoFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(field_name='nome', lookup_expr='icontains')
    tipo = django_filters.CharFilter(field_name='tipo', lookup_expr='icontains')
    quantidade = django_filters.NumberFilter(field_name='quantidade')

    class Meta:
        model = Produto
        fields = ['nome', 'tipo', 'quantidade']

class MovimentacaoFilter(django_filters.FilterSet):
    data_operacao = django_filters.DateFilter(field_name='data_operacao', lookup_expr='gte')

    class Meta:
        model = Movimentacao
        fields = ['data_operacao']
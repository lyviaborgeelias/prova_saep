from django.contrib import admin
from .models import Usuario, Produto, Movimentacao


# ================================
# ADMIN DO USUARIO
# ================================
@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "login", "nome")
    search_fields = ("login", "nome")
    ordering = ("login",)


# ================================
# ADMIN DO PRODUTO
# ================================
@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nome",
        "tipo",
        "especificacao",
        "quantidade",
        "preco",
        "estoque_atual",
        "estoque_minimo",
        "data_cadastro",
    )
    search_fields = ("nome", "tipo")


# ================================
# ADMIN DA MOVIMENTAÇÃO
# ================================
@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = (
        "id_movimentacao",
        "produtoID",
        "responsavelID",
        "tipo",
        "quantidade",
        "data_operacao",
    )
    list_filter = ("tipo", "data_operacao")
    search_fields = ("produtoID__nome", "responsavelID__login")
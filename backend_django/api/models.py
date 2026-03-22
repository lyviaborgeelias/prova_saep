from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import transaction

class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    nome = models.CharField(max_length=100)
    login = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome


class Produto(models.Model):
    nome = models.CharField(max_length=200)
    tipo = models.TextField(blank=True, null=True)
    especificacao = models.TextField(blank=True, null=True)
    quantidade = models.IntegerField(default=0)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    estoque_atual = models.IntegerField(default=0)
    estoque_minimo = models.IntegerField(default=0)
    data_cadastro = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.nome


class Movimentacao(models.Model):
    TIPO_CHOICES = (
        ("entrada", "Entrada"),
        ("saida", "Saída"),
    )

    id_movimentacao = models.AutoField(primary_key=True)
    produtoID = models.ForeignKey(Produto, on_delete=models.CASCADE, db_column="id_produto")
    quantidade = models.IntegerField()
    responsavelID = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column="id_usuario")
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    data_operacao = models.DateField()

    @transaction.atomic
    def save(self, *args, **kwargs):
        produto = Produto.objects.select_for_update().get(pk=self.produtoID.pk)

        if self.tipo == "entrada":
            produto.estoque_atual += self.quantidade
        else:
            if produto.estoque_atual < self.quantidade:
                raise ValueError("Estoque insuficiente")
            produto.estoque_atual -= self.quantidade

        produto.save()

        super().save(*args, **kwargs)

from rest_framework import serializers
from .models import Usuario, Produto, Movimentacao

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nome', 'login', 'password']

    def create(self, validated_data):
        return Usuario.objects.create(**validated_data)

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class MovimentacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimentacao
        fields = '__all__'
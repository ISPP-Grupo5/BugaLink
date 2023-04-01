from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import EnrichedTokenObtainPairSerializer


class EnrichedObtainTokenPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EnrichedTokenObtainPairSerializer

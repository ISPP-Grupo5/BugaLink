from django.test import TestCase
from rest_framework.test import APIClient

import json

from users.models import User
from passengers.models import Passenger
from chats.models import Conversation

from users.tests import load_complex_data

def load_chats_extra_data(self):
    '''
    Crea:
    * self.conversation, una conversación entre self.user_1 y self.user_2
    * self.user_3, un nuevo usuario, junto a su respectivo self.passenger_3
    '''
    load_complex_data(self)
    self.conversation = Conversation.objects.create(
        initiator=self.user,
        receiver=self.user_2,
    )
    self.user_3 = User.objects.create(
        email="test3@test.com",
        first_name="Third User",
        last_name="lastNameTest3",
        is_passenger=True,
        is_driver=False,
    )
    self.passenger_3 = Passenger.objects.create(user=self.user_3)
    
class TripConversationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        load_chats_extra_data(self)
        self.client.force_authenticate(user=self.user)
        
    # Obtiene la conversación con otro usuario con el que ya existía una conversación
    def test_get_conversation(self):
        url = "/api/v1/users/" + str(self.user_2.id) + "/conversation/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["id"], self.conversation.id)
        
    # Obtiene la conversación con otro usuario por primera vez
    def test_get_new_conversation(self):
        url = "/api/v1/users/" + str(self.user_3.id) + "/conversation/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(Conversation.objects.all()), 2) # Se espera que se cree una conversación nueva
        self.assertEqual(Conversation.objects.get(receiver=self.user_3).initiator, self.user) # Se espera que la conversación nueva tenga al usuario 1 como iniciador
        
    # Intenta obtener la conversación con uno mismo, pero no puede
    def test_get_conversation_with_self(self):
        url = "/api/v1/users/" + str(self.user.id) + "/conversation/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 400)
        
    # Obtene la lista de conversaciones del usuario, luego crea una nueva, y verifica que se ha incrementado el número de conversaciones
    def test_get_conversations(self):
        url = "/api/v1/conversations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["id"], self.conversation.id)
        
        Conversation.objects.create(
            initiator=self.user,
            receiver=self.user_3,
        )
        
        url = "/api/v1/conversations/"
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)
export class Api {
  constructor ({ baseUrl, idInstance, apiTokenInstance, chatId, count }) {
    this.baseUrl = baseUrl
    this.idInstance = idInstance
    this.apiTokenInstance = apiTokenInstance
    this.chatId = chatId
    this.count = count
  }

  // проверим ответ
  checkResponse (res) {
    if (res.ok) {
      return res.json()
    } else {
      return Promise.reject(`Ошибка: ${res.status}`)
    }
  }

  // метод отправки сообщения
  sendMessage (message) {
    return fetch(
      `${this.baseUrl}/waInstance${this.idInstance}/SendMessage/${this.apiTokenInstance}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: this.chatId,
          message: message
        })
      }
    ).then(this.checkResponse)
  }

  // метод получения уведомления
  receiveNotification () {
    return fetch(
      `${this.baseUrl}/waInstance${this.idInstance}/receiveNotification/${this.apiTokenInstance}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(this.checkResponse)
  }

  // метод удаления уведомления
  deleteNotification (receiptId) {
    return fetch(
      `${this.baseUrl}/waInstance${this.idInstance}/deleteNotification/${this.apiTokenInstance}/${receiptId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(this.checkResponse)
  }
}

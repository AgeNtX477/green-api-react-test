import { useEffect, useState } from 'react'
import './App.css'
import { Api } from '../../utils/api'
import Popup from '../Popup/Popup'

function App () {
  const url = 'https://api.green-api.com'

  // стейт для модалки
  const [isPopupOpen, setPupupOpen] = useState(true)

  // стейт для отображения сообщений
  const [messages, setMessages] = useState([])

  // стейт инпута
  const [value, setValue] = useState('')

  // стейт для наполнения данных пользователя
  const [credentials, setCredentials] = useState({
    id: 'Введите данные',
    token: 'Введите данные',
    chatId: 'Введите данные'
  })

  const [isData, setData] = useState(false)

  const chatIdDisplayed = credentials.chatId + '@c.us'

  // экземпляр класса api
  const api = new Api({
    baseUrl: url,
    idInstance: credentials.id,
    apiTokenInstance: credentials.token,
    chatId: chatIdDisplayed,
  })

  const makeid = () => {
    let text = ''
    const possible = 'QWER0123456789'

    for (let i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
  }

  function sendMessage () {
    if (value !== '') {
      let varId = makeid()
      api
        .sendMessage(value)
        .then(() => {
          setMessages([
            { message: value, ownMessage: true, id: varId },
            ...messages
          ])
          setValue('')
        })
        .catch(err => console.log(`Произошла ошибка: ${err}`))
    }
    console.log(messages)
  }

  function getMessage () {
    let varId2 = makeid()
    api
      .receiveNotification()
      .then(res => {
        if (res !== null) {
          if (chatIdDisplayed === res.body.senderData.chatId) {
            setMessages(oldMessages => [
              {
                message: res.body.messageData.textMessageData.textMessage,
                ownMessage: false,
                id: varId2
              },
              ...oldMessages
            ])
            api.deleteNotification(res.receiptId)
          } else {
            api.deleteNotification(res.receiptId)
          }
        } else {
          console.log('Уведомлений нет')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (isData) {
      const setIntervalFunction = () => {
        setInterval(getMessage, 5000)
      }
      setIntervalFunction()
    }
  }, [isData])

  function handleСredentialsEnter (data) {
    setCredentials(data)
    setPupupOpen(false)
    setData(true)
  }

  function handlePopupOpen () {
    setPupupOpen(true)
    setData(false)
  }

  function handlePopupClose () {
    setPupupOpen(false)
  }

  return (
    <div className='page'>
      <div className='main__bckgrnd-green'></div>
      <main className='main__content'>
        <div className='main__header'>
          <div className='main__user-info'>
            <div className='main__user-IdInstance'>{`Ваш idInstance: ${credentials.id}`}</div>
            <div className='main__user-IdInstance'>
              {`Ваш apiTokenInstance: ${credentials.token}`}
            </div>
          </div>
          <div className='main__recipient-num'>{`Номер получателя: ${credentials.chatId}`}</div>
          <button
            className='main__update-credentials-button'
            onClick={handlePopupOpen}
          >
            обновить данные
          </button>
        </div>
        <div className='main__chat-table'>
          <ul className='main__chat-container'>
            {/* рендерим сообщения */}
            {messages.map(entry => (
              <li
                key={entry.id}
                data={entry.id}
                className={`main__chat-message ${
                  /* если сообщение наше, то отрисуем его в левом углу, если нет, в правом */
                  !entry.ownMessage ? 'main__chat-message_chat-partner' : ''
                }`}
              >
                {[entry.message, entry.ownMessage]}
              </li>
            ))}
          </ul>
        </div>
        <div className='main__message-table'>
          <input
            name='input'
            type='text'
            placeholder='Введите сообщение'
            className='main__message-input'
            required
            autoComplete='off'
            value={value}
            onChange={e => setValue(e.target.value)}
          ></input>
          <button onClick={sendMessage} className='main__send-message-button'>
            {'отправить'}
          </button>
        </div>
      </main>
      <Popup
        isPopupOpen={isPopupOpen}
        onClose={handlePopupClose}
        onSubmit={handleСredentialsEnter}
      />
    </div>
  )
}

export default App

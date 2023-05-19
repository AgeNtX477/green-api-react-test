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
    count: 1
  })

  const makeid = () => {
    let text = ''
    const possible = 'QWER0123456789'

    for (let i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
  }

  let varId = makeid()

  function sendMessage () {
    if (value !== '') {
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
    api
      .receiveNotification()
      .then(res => {
        console.log(res)
        if (res !== null) {
          if (chatIdDisplayed === res.body.senderData.chatId) {
            setMessages([
              {
                message: res.body.messageData.textMessageData.textMessage,
                ownMessage: false,
                id: res.body.idMessage
              },
              ...messages
            ])
            console.log(messages)
            api.deleteNotification(res.receiptId)
          } else {
            api.deleteNotification(res.receiptId)
          }
        } else {
          console.log('Уведомлений нет')
          console.log(messages)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (isData) {
      const setIntervalFunction = () => {
        setInterval(getMessage, 7000)
      }
      setIntervalFunction()
    }
  }, [isData])

  function handleСredentialsEnter (data) {
    setCredentials(data)
    popupToggle()
    setData(true)
  }

  function popupToggle () {
    isPopupOpen ? setPupupOpen(false) : setPupupOpen(true)
  }

  /* const sortedMessages = useMemo(getMessage, []) */

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
            onClick={getMessage}
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
            {'=>'}
          </button>
        </div>
      </main>
      <Popup
        isPopupOpen={isPopupOpen}
        onClose={popupToggle}
        onSubmit={handleСredentialsEnter}
      />
    </div>
  )
}

export default App

/*  function getMessage () {
    api
      .getMessage()
      .then(res => {
        let idMessage = res[0].idMessage
        if (!idArrCopy.includes(idMessage)) {
          setMessages([
            { message: res[0].textMessage, ownMessage: false },
            ...messages
          ])
          idArrCopy.push(idMessage)
          setIdArr(idArrCopy)
        } else {
          console.log(`Такой Id уже есть: ${idArr}`)
        }
      })
      .catch(err => console.log(err))
  } */

/*   useEffect(
    () => {
      if (isData) {
        const setIntervalFunction = () => {
          setInterval(getMessage, 7000)
        }
        setIntervalFunction()
      }
    },
    [isData]
  )
 */

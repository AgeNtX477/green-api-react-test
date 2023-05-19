import { useState } from 'react'
import './Popup.css'

function Popup (props) {
  const [id, setId] = useState('')
  const [token, setToken] = useState('')
  const [chatId, setChatId] = useState('')

  function handleIdChange (e) {
    setId(e.target.value)
  }

  function handleTokenChange (e) {
    setToken(e.target.value)
  }

  function handleChatIdChange (e) {
    setChatId(e.target.value)
  }

  function handleSubmit (e) {
    e.preventDefault()
    props.onSubmit({
      id: id,
      token: token,
      chatId: chatId
    })
  }

  return (
    <div className={`popup ${props.isPopupOpen ? `popup_opened` : ''}`}>
      <div className='popup__container'>
        <h1 className='popup__title'>
          Введите учетные данные из системы GREEN-API (idInstance,
          apiTokenInstance) а также номер получателя.
        </h1>
        <form className='popup__form>' onSubmit={handleSubmit}>
          <input
            className='popup__input popup__input_type_id'
            placeholder='Введите idInstance'
            name='idInstance'
            required
            onChange={handleIdChange}
            value={id ? id : ''}
          ></input>
          <input
            className='popup__input popup__input_type_token'
            placeholder='Введите apiTokenInstance'
            name='apiTokenInstance'
            required
            onChange={handleTokenChange}
            value={token ? token : ''}
          ></input>
          <input
            className='popup__input popup__input_type_chatId'
            placeholder='Введите chatId (номер телефона)'
            name='chatId'
            required
            onChange={handleChatIdChange}
            value={chatId ? chatId : ''}
          ></input>
          <button type='submit' className='popup__submit'>
            Сохранить
          </button>
        </form>
        <button
          onClick={props.onClose}
          className='popup__close-btn'
          type='button'
        ></button>
      </div>
    </div>
  )
}

export default Popup

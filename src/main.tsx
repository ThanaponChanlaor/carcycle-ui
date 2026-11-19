import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { setRole } from '@/features/auth/authSlice'
import { watchAdmin } from '@/services/adminAuth'
import App from '@/App'
import '@/index.css'

// In firestore mode the Firebase session, not localStorage, decides who is admin.
watchAdmin((isAdmin) => store.dispatch(setRole(isAdmin ? 'admin' : 'user')))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)

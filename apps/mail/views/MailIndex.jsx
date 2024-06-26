const { useState, useEffect } = React
const { useLocation } = ReactRouter
const { useSearchParams } = ReactRouterDOM

import { MailFilter } from '../cmps/MailFilter.jsx'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { SidebarMenu } from '../cmps/SidebarMenu.jsx'
import { mailService } from '../services/mail.service.js'
import { MailAppHeader } from '../cmps/MailAppHeader.jsx'
import { ComposeEmail } from '../cmps/ComposeEmail.jsx'
import { MailDetails } from './MailDetails.jsx'

export function MailIndex() {
  const [mailMainContent, setMailMainContent] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [emails, setEmails] = useState(null)
  const [filterBy, setFilterBy] = useState(
    mailService.getFilterFromSearchParams(searchParams)
  )
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [unreadMailsCount, setUnreadMailsCount] = useState(0)
  const [sidebarHover, setSidebarHover] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767)

  const hasComposeParam = searchParams.has('compose')

  
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  useEffect(() => {
    if (pathname.includes('details')) {
      setMailMainContent('details')
    } else {
      setMailMainContent('mailList')
    }
  }, [location])
  
  useEffect(() => {
    if (!hasComposeParam) {
      setSearchParams(filterBy)
    }
    loadMails()
  }, [filterBy])
  
  useEffect(() => {
    if (!emails) return
    if (filterBy.folder === 'starred') {
      countUnreadMails()
    }
    if (filterBy.folder === 'inbox') {
      setUnreadMailsCount(emails.filter(mail => !mail.isRead).length)
    }
  }, [emails])
  
  function handleResize() {
    const currIsMobile = window.innerWidth <= 767
    setIsMobile(currIsMobile)
  }
  
  function loadMails() {
    mailService
    .query(filterBy)
      .then(setEmails)
      .catch(err => console.log('err:', err))
  }

  function onToggleIsStar(mailId, isStar) {
    mailService
      .get(mailId)
      .then(mailToUpdate => {
        const mailIndex = emails.findIndex(mail => mail.id === mailId)

        if (mailIndex !== -1) {
          const updatedMails = [...emails]
          updatedMails[mailIndex] = { ...mailToUpdate, isStar: isStar }
          setEmails(updatedMails)
        }
        return mailService.save({ ...mailToUpdate, isStar: isStar })
      })
      .catch(err => {
        console.log('err:', err)
      })
  }

  function onToggleIsRead(mailId, isRead) {
    mailService
      .get(mailId)
      .then(mailToUpdate => {
        const mailIndex = emails.findIndex(mail => mail.id === mailId)

        if (mailIndex !== -1) {
          const updatedMails = [...emails]
          updatedMails[mailIndex] = { ...mailToUpdate, isRead: isRead }
          setEmails(updatedMails)
        }
        mailService.save({ ...mailToUpdate, isRead: isRead })
      })
      .catch(err => {
        console.log('err:', err)
      })
  }

  function onRemove(mailId) {
    mailService
      .remove(mailId)
      .then(() => {
        setEmails(prevMails => prevMails.filter(mail => mail.id !== mailId))
        showSuccessMsg(`Mail successfully removed!`)
      })
      .catch(err => {
        console.log('err:', err)
        showErrorMsg("Error - couldn't remove the mail")
      })
  }

  function onSetFilterBy(newFilter) {
    setFilterBy({ ...newFilter })
  }

  function countUnreadMails() {
    return mailService
      .query()
      .then(mails => {
        if (!mails) return 0
        const unreadMails = mails.filter(mail => !mail.isRead)
        console.log(unreadMails.length)
        // return unreadMails.length
        setUnreadMailsCount(unreadMails.length)
      })
      .catch(error => {
        console.error('Error fetching mails:', error)
        return 0
      })
  }

  function readAllEmails() {
    const updatedMails = emails.map(email => ({ ...email, isRead: true }))
    mailService.saveMails(updatedMails).then(setEmails(updatedMails))
  }

  function mailToRemoveFolder(id) {
    const updatedMail = emails.find(mail => mail.id === id)
    if (updatedMail.removedAt !== null) {
      return onRemove(id)
    }
    updatedMail.removedAt = new Date().getTime()
    mailService
      .save(updatedMail)
      .then(setEmails(prevMails => prevMails.filter(email => email.id !== id)))
  }

  const hoveredSidebar = sidebarHover || toggleSidebar

  return (
    <React.Fragment>
      {!emails ? (
        <h3>...Loading</h3>
      ) : (
        <div className={`email-grid ${hoveredSidebar ? 'sidebar-open' : ''}`}>
          <div className="email-header">
            <MailAppHeader
              isMobile={isMobile}
              setToggleSidebar={setToggleSidebar}
            />
            <MailFilter
              isMobile={isMobile}
              setMailMainContent={setMailMainContent}
              onSetFilterBy={onSetFilterBy}
              filterBy={filterBy}
            />
          </div>
          {mailMainContent === 'mailList' && (
            <MailList
              filterBy={filterBy}
              onSetFilterBy={onSetFilterBy}
              setMailMainContent={setMailMainContent}
              readAllEmails={readAllEmails}
              emails={emails}
              mailToRemoveFolder={mailToRemoveFolder}
              onToggleIsStar={onToggleIsStar}
              onToggleIsRead={onToggleIsRead}
            />
          )}
          {mailMainContent === 'details' && (
            <MailDetails setMailMainContent={setMailMainContent} />
          )}
          <SidebarMenu
            isMobile={isMobile}
            mailMainContent={mailMainContent}
            setMailMainContent={setMailMainContent}
            hoveredSidebar={hoveredSidebar}
            setToggleSidebar={setToggleSidebar}
            sidebarHover={sidebarHover}
            setSidebarHover={setSidebarHover}
            filterBy={filterBy}
            onSetFilterBy={onSetFilterBy}
            unreadMailsCount={unreadMailsCount}
          />
          {hasComposeParam && <ComposeEmail />}
        </div>
      )}
    </React.Fragment>
  )
}

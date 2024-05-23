export function SidebarLabel({ label, folder, handleChange, sidebarHover, unreadMails }) {
  function folderLogo(label) {
    var logo
    switch (label) {
      case 'inbox':
        logo = 'fa-solid fa-inbox'
        break
      case 'starred':
        logo = 'fa-regular fa-star'
        break
      case 'sent':
        logo = 'fa-regular fa-paper-plane'
        break
      case 'drafts':
        logo = 'fa-regular fa-file'
        break
    }
    return logo
  }

  return (
    <div
      key={label}
      onClick={() => handleChange(label)}
      className={`sidebar-label ${folder === label ? 'active' : ''}
          ${sidebarHover && 'hovered'}`}
    >
      <i className={folderLogo(label)}></i>
      {sidebarHover && (
        <React.Fragment>
          <p>{label}</p>
          {label === 'inbox' && <span>{unreadMails}</span>}
        </React.Fragment>
      )}
    </div>
  )
}

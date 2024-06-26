
export function NoteSidebarLabel({ isSidebarOpen, label, folder, handleChange, isOpen, folderToEdit }) {
  // console.log(location.pathname);
  // console.log(folderToEdit.folder);
  // console.log(label)
  // console.log(folderToEdit);

  const logo = folderLogo(label)

  function folderLogo(label) {
    switch (label) {
      case 'notes':
        return 'fa-regular fa-lightbulb'

      case 'trash':
        return 'fa-regular fa-trash-can'
    }
  }

  return (
    <li className={`${folderToEdit.folder === label ? 'active' : ''} flex flex-row`} onClick={() => handleChange(label)}>
      <i className={logo}></i>
      {isSidebarOpen && <h4>{label}</h4>}
    </li>
  )
}

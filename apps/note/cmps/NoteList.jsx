const { Link, useNavigate } = ReactRouterDOM;
const { useState, useEffect, useRef } = React;

import { NotePreview } from "../cmps/NotePreview.jsx";

export function NoteList({ notes, onRemove, onPin, onDuplicate, onChangeColor, onTrash }) {
    const [colorPickerVisibility, setColorPickerVisibility] = useState({});

    const colorPalette = ['#eceae7', '#efe3dd', '#ebd8e7', '#c4d6e4', '#dde6ea', '#d4e7dc', '#e9efdb', '#f8f9da', '#f8e5c5', '#f8d0cc'];
    const navigate = useNavigate();

    if (!notes) return null;

    const handleColorChange = (noteId, color) => {
        onChangeColor(noteId, color);
        toggleColorPicker(noteId); // Close the color picker
    };

    const toggleColorPicker = (noteId) => {
        setColorPickerVisibility(prevVisibility => ({
            ...prevVisibility,
            [noteId]: !prevVisibility[noteId]
        }));
    };

    function onSendMail(note) {
        let subject = note.info.title;
        let body = '';

        if (note.type === 'NoteTxt') {
            body = note.info.txt;
        } else if (note.type === 'NoteTodos') {
            body = note.info.todos.map(todo => `- ${todo.txt}`).join('\n');
        } else if (note.type === 'NoteImg') {
            body = `Image link: ${note.info.url}`;
        } else if (note.type === 'NoteVideo') {
            body = `Video link: ${note.info.url}`;
        } else if (note.type === 'NoteAudio') {
            body = `Audio link: ${note.info.url}`;
        } else if (note.type === 'NoteMap') {
            body = `Map coords: lat:${note.info.coords.lat} lng:${note.info.coords.lng}`
        }

        navigate({
            pathname: '/mail',
            search: `?compose=note&subject=${subject}&body=${(body)}`,
        });
    }
    const pinnedNotes = notes.filter(note => note.isPinned);
    const unpinnedNotes = notes.filter(note => !note.isPinned);

    return (
        <div className="note-list">
            {/* Pinned Notes Section */}
            {pinnedNotes.length > 0 && (
                <div className="pinned-notes-section">
                    <h2>Pinned Notes</h2>
                    {pinnedNotes.map(note => {
                        const backgroundColor = note.style && note.style.backgroundColor ? note.style.backgroundColor : '#f8e5c5';
                        return (
                            <div key={note.id} className='note-card note-list-item' style={{ backgroundColor }}>
                                <NotePreview note={note} />
                                <div className="note-actions">
                                    <button onClick={() => {
                                        if (!note.isTrash) {
                                            onTrash(note.id);
                                        } else {
                                            onRemove(note.id);
                                        }
                                    }} className='fa fa-trash'></button>
                                    <button onClick={() => onPin(note.id)} className={`fa ${note.isPinned ? 'fa-thumbtack' : 'fa-map-pin'}`}></button>
                                    <button onClick={() => onDuplicate(note.id)} className='fa fa-clone'></button>
                                    <Link to={`/note/edit/${note.id}`} className="action-button">
                                        <button className='fa fa-edit'></button>
                                    </Link>
                                    <button onClick={() => toggleColorPicker(note.id)} style={{ position: 'relative' }} className='fa fa-paint-brush'></button>
                                    <button onClick={() => onSendMail(note)} className='fa fa-envelope'></button>
                                </div>
                                {colorPickerVisibility[note.id] && (
                                    <div className='color-palette' style={{ position: 'absolute', top: '0', left: '40px', display: 'flex', flexDirection: 'row' }}>
                                        {colorPalette.map(color => (
                                            <div
                                                key={color}
                                                className='color-option'
                                                style={{ backgroundColor: color, margin: '0 5px' }}
                                                onClick={() => handleColorChange(note.id, color)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Unpinned Notes Section */}
            {unpinnedNotes.length > 0 && (
                <div className="unpinned-notes-section">
                    <h2>Other Notes</h2>
                    {unpinnedNotes.map(note => {
                        const backgroundColor = note.style && note.style.backgroundColor ? note.style.backgroundColor : '#f8e5c5';
                        return (
                            <div key={note.id} className='note-card note-list-item' style={{ backgroundColor }}>
                                <NotePreview note={note} />
                                <div className="note-actions">
                                    <button onClick={() => {
                                        if (!note.isTrash) {
                                            onTrash(note.id);
                                        } else {
                                            onRemove(note.id);
                                        }
                                    }} className='fa fa-trash'></button>
                                    <button onClick={() => onPin(note.id)} className={`fa ${note.isPinned ? 'fa-thumbtack' : 'fa-map-pin'}`}></button>
                                    <button onClick={() => onDuplicate(note.id)} className='fa fa-clone'></button>
                                    <Link to={`/note/edit/${note.id}`} className="action-button">
                                        <button className='fa fa-edit'></button>
                                    </Link>
                                    <button onClick={() => toggleColorPicker(note.id)} style={{ position: 'relative' }} className='fa fa-paint-brush'></button>

                                    {(note.type !== 'NoteMap') && (
                                        <button onClick={() => onSendMail(note)} className='fa fa-envelope'></button>
                                    )}
                                </div>
                                {colorPickerVisibility[note.id] && (
                                    <div className='color-palette' style={{ position: 'absolute', top: '0', left: '40px', display: 'flex', flexDirection: 'row' }}>
                                        {colorPalette.map(color => (
                                            <div
                                                key={color}
                                                className='color-option'
                                                style={{ backgroundColor: color, margin: '0 5px' }}
                                                onClick={() => handleColorChange(note.id, color)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
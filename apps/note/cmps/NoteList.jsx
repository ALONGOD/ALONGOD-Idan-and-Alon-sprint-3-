const { Link } = ReactRouterDOM;
const { useState, useEffect, useRef } = React;

import { NotePreview } from "../cmps/NotePreview.jsx";

export function NoteList({ notes, onRemove, onPin, onDuplicate, onChangeColor }) {
    const [colorPickerVisibility, setColorPickerVisibility] = useState({});

    const colorPalette = ['#eceae7', '#efe3dd', '#ebd8e7', '#c4d6e4', '#dde6ea', '#d4e7dc', '#e9efdb', '#f8f9da', '#f8e5c5', '#f8d0cc'];

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

    return (
        <div className="note-list">
            {notes.map(note => {
                const backgroundColor = note.style && note.style.backgroundColor ? note.style.backgroundColor : '#f8e5c5';
                return (
                    <div key={note.id} className='note-card' style={{ backgroundColor }}>
                        <NotePreview note={note} />
                        <div className="note-actions">
                            <button onClick={() => onRemove(note.id)} className='fa fa-trash'></button>
                            <button onClick={() => onPin(note.id)} className={`fa ${note.isPinned ? 'fa-thumbtack' : 'fa-map-pin'}`}></button>
                            <button onClick={() => onDuplicate(note.id)} className='fa fa-clone'></button>
                            <Link to={`/note/edit/${note.id}`} className="action-button">
                                <button className='fa fa-edit'></button>
                            </Link>
                            <button onClick={() => toggleColorPicker(note.id)} style={{ position: 'relative' }} className='fa fa-paint-brush'></button>
                            <Link to={`/mail/details/${note.id}`} className="action-button">
                                <button className='fa fa-envelope'></button>
                            </Link>
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
    );
}

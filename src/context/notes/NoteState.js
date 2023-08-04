import React,{useState} from "react";
import NoteContext from "./noteContext";

const NoteState=(props)=>{
  const host="http://localhost:5000";
  // const id="64b2d162b0b634691265c767";

    const notesInitial=[]

    const [notes, setNotes] = useState(notesInitial)

      // Fetch All Note
      const getNotes=async()=>{
        // TODO API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiMDdjOTk5NWY0MDY0M2I5MzVmNGM2In0sImlhdCI6MTY4OTM1MjM5N30.LDb-P2UhjsxcSJOdJTWAPOsRnp57YVJDsbhevEO9Lhw"
          },
        });
        const json=await response.json();
        setNotes(json);
      }

      
      // Add Note
      const addNote=async(title, description, tag)=>{
        // TODO API call
        const response = await fetch(`${host}/api/notes/addNotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiMDdjOTk5NWY0MDY0M2I5MzVmNGM2In0sImlhdCI6MTY4OTM1MjM5N30.LDb-P2UhjsxcSJOdJTWAPOsRnp57YVJDsbhevEO9Lhw"
          },
          body: JSON.stringify({title,description,tag})
        });
        const note=await response.json(); 
        setNotes(notes.concat(note))
      }


      // Delete a Note
      const deletenote=async(id)=>{
        // TODO API call
        const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiMDdjOTk5NWY0MDY0M2I5MzVmNGM2In0sImlhdCI6MTY4OTM1MjM5N30.LDb-P2UhjsxcSJOdJTWAPOsRnp57YVJDsbhevEO9Lhw"
          },
        });
        const json=await response.json(); 
        const newNote=notes.filter((note)=>{return note._id!==id});
        setNotes(newNote);
      }


      
      // Edit a Note
      const editNote=async(id, title, description, tag)=>{
        // TODO API Calls
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiMDdjOTk5NWY0MDY0M2I5MzVmNGM2In0sImlhdCI6MTY4OTM1MjM5N30.LDb-P2UhjsxcSJOdJTWAPOsRnp57YVJDsbhevEO9Lhw"
          },
          body: JSON.stringify({title,description,tag})
        });
        const json=await response.json(); 
      
        let newNotes=JSON.parse(JSON.stringify(notes));
        // Logic to Edit notes for client
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if (element._id===id){
            newNotes[index].title=title;
            newNotes[index].description=description;
            newNotes[index].tags=tag;
            break;
          }
        }
        setNotes(newNotes);

      }

    return(
        <NoteContext.Provider value={{notes, addNote, deletenote, editNote, getNotes}}> 
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState;
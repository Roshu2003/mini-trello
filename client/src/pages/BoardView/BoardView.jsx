import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function BoardView() {
  const { id } = useParams();
  const [lists, setLists] = useState([]);

  useEffect(() => {
    API.get(`/boards/${id}/lists`).then((res) => setLists(res.data));
  }, [id]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    // TODO: call backend to update positions
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* <div style={{ display: "flex" }}>
        {lists.map((list, idx) => (
          <Droppable key={list._id} droppableId={list._id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ margin: 10, border: "1px solid gray", padding: 10 }}
              >
                <h3>{list.title}</h3>
                {list.cards.map((card, i) => (
                  <Draggable key={card._id} draggableId={card._id} index={i}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        style={{
                          border: "1px solid black",
                          padding: 5,
                          margin: "5px 0",
                          ...prov.draggableProps.style,
                        }}
                      >
                        {card.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div> */}
    </DragDropContext>
  );
}

export default BoardView;

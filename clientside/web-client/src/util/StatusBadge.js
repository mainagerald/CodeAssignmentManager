import React from 'react'
import { Badge } from 'react-bootstrap';

const StatusBadge = (props) => {
    const { text } = props;
console.log("badge" +text);

    function getBadgeCol(text){
        return text === "Pending Submission" ? "warning"
            : text === "Submitted" ? "info"
            : text === "In review" ? "secondary"
            : text === "Needs update" ? "danger"
            : text === "Completed" ? "success"
            :"";
        
    }
  return (
    <Badge
              pill
              bg={getBadgeCol(text)}
              style={{ fontSize: "1.1rem" }}
            >
              {text}
            </Badge>
  )
}

export default StatusBadge

//client/src/components/pagination/pageination.jsx

import React from "react";

const Pageination = ({postsPerPage, totalPosts, paginate}) => {
    const pageNumbers = [];

    for(let i = 1; i<=Math.ceil(totalPosts/postsPerPage);i++){
        pageNumbers.push(i)
    }
    //console.log(pageNumbers)
  return (
    <nav>
      <ul className="pagination pagination-lg">
        {pageNumbers.map(number=>{
            return(
                <li key={number} className="page-item">
                    <a onClick={()=>paginate(number)} className="page-link">
                        {number}
                    </a>
                </li>
            )
        })}
      </ul>
    </nav>
  )
}

export default Pageination

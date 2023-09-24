//import React, { useState, useEffect } from 'react';
//import MovieImageArr from "./MovieImages.js";
//import RankingGrid from './RankingGrid.js';

//const RankItems = () => {

//    const [items, setItems] = useState([]);
//    const dataType = 1;

//    function drag(ev) {
//        ev.dataTransfer.setData("text", ev.target.id);
//    }

//    useEffect(() => {
//        fetch(`item/${dataType}`)
//            .then((results) => {
//                return results.json();
//            })
//            .then(data => {
//                setItems(data);
//            })
//    }, [])

//    return (

//        <main>
//            <RankingGrid items={items} imgArr={MovieImageArr} />
//            <div className = "items-not-ranked">
//                {
//                    (items.length > 0) ? items.map((item) =>
//                        <div className="unranked-cell">
//                        <img id={`item-${item.id}`} src={MovieImageArr.find(o => o.id === item.imageId)?.image} />
//                    </div>
//                    ) : <div>Loading...</div>
//                }
//            </div>
//        </main>
//    )
//}
//export default RankItems;

import { useEffect, useState } from 'react';
import RankingGrid from "./RankingGrid";
import ItemCollection from "./ItemCollection";

const RankItems = ({ items, setItems, dataType, imgArr, localStorageKey }) => {

    const [reload, setReload] = useState(false);

    function Reload() {
        setReload(true);
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drop(ev) {

        ev.preventDefault();
        const targetElm = ev.target;
        if (targetElm.nodeName === "IMG") {
            return false;
        }
        if (targetElm.childNodes.length === 0) {
            var data = parseInt(ev.dataTransfer.getData("text").substring(5));
            const transformedCollection = items.map((item) => (item.id === parseInt(data)) ?
                { ...item, ranking: parseInt(targetElm.id.substring(5)) } : { ...item, ranking: item.ranking });
            setItems(transformedCollection);
        }

    }
    useEffect(() => {
        if (items == null) {
            getDataFromApi();
        }

    }, [dataType]);

    function getDataFromApi() {
        fetch(`item/${dataType}`)
            .then((results) => {
                return results.json();
            })
            .then(data => {

                setItems(data);
            })
    }

    useEffect(() => {
        if (items != null) {
            localStorage.setItem(localStorageKey, JSON.stringify(items));
        }
        setReload(false);
    }, [items])

    useEffect(() => {
        if (reload === true) {
            getDataFromApi();
        }
    }, [reload])


    return (
        (items != null) ?
            <main>
                <RankingGrid items={items} imgArr={imgArr} drag={drag} allowDrop={allowDrop} drop={drop} />
                <ItemCollection items={items} drag={drag} imgArr={imgArr} />
                <button onClick={Reload} className="reload" style={{ "marginTop": "10px" }}> <span className="text" >Reload</span > </button>
            </main>
            : <main>Loading...</main>
    )
}
export default RankItems;
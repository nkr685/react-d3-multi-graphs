function Radio(props) {
    const {options, defaultValue, handleChange} = props
    return (
        <div className="row-items">{options.map(
                (opt, idx) =>
                    <div key={idx} >
                        <input id={`radio_${idx}`} type="radio" name="options" value={opt} checked={opt === defaultValue} onChange={handleChange}/>
                        <label htmlFor={`radio_${idx}`} onClick={() => handleChange} style={{marginRight: "10px"}}>{opt}</label>
                    </div>
            )
        }
        </div>
    )
}

export default Radio;
function Dropdown (props) {
    const { defaultValue, options, handleChange } = props;
    return (
        <div>
            <select onChange={handleChange}>
                {options.map((opt, idx) => 
                    <option key={idx} checked={opt === defaultValue}>{opt}</option>
                )}
            </select>

        </div>
    )
}

export default Dropdown
import { UPDATE_VALUE, CLEAR_FORM, LOAD_NALOG } from 'actions'

function pad(s) {
	return (s < 10) ? '0' + s : s;
}

function getTimestamp() {
	
	let d = new Date();
	return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join("");
}

const _defaultState = {
    nalog: {
        naziv: '',
        platitelj__ime: '',
        platitelj__adresa: '',
        platitelj__gradMjesto: '',
        primatelj__ime: 'Udruga Šapa u srcu',
        primatelj__adresa: ' ',
        primatelj__gradMjesto: ' ',
        primatelj__iban: 'HR6724020061100675185',
        iznos: '',
        primatelj__model: 'HR00',
        primatelj__pozivNaBroj: getTimestamp(),
        sifra__namjene: '',
        opis_placanja: 'Donacija'
    }
};

const nalog = (state, action) => {
    switch(action.type) {
        case UPDATE_VALUE:
            return(Object.assign({}, state, { [action.id]:action.value }));
        case CLEAR_FORM:
            return(Object.assign({}, state, _defaultState.nalog));
        case LOAD_NALOG:
            return(Object.assign({}, state, action.nalog));
    }

    return(state);
}

const reducer = (state=_defaultState, action) => {
    return({
        nalog: nalog(state.nalog, action)
    })
}

export { reducer }
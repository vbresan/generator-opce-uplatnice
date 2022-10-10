import { UPDATE_VALUE, CLEAR_FORM, LOAD_NALOG } from 'actions'

const _defaultState = {
    nalog: {
        naziv: '',
        platitelj__ime: '',
        platitelj__adresa: '',
        platitelj__gradMjesto: '',
        primatelj__ime: 'HU Dobra Volja',
        primatelj__adresa: ' ',
        primatelj__gradMjesto: ' ',
        primatelj__iban: 'HR0524020061100787075',
        iznos: '',
        primatelj__model: 'HR00',
        primatelj__pozivNaBroj: '69192782199',
        sifra__namjene: 'CHAR',
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
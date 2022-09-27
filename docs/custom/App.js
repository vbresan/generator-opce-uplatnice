import { Forma } from 'Forma';
import { reducer } from 'reducers';

const store = Redux.createStore(reducer);

class App extends React.Component {

    constructor(props) {
        super(props);

        BarcodePayment.Init({
            ValidateIBAN: false, // Validation is not yet implemented
            ValidateModelPozivNaBroj: true // Validation is not yet implemented
        });
    }

    render() {

        return(
            <div>
                <ReactRedux.Provider store={store}>
                    <div>
                        <Forma />
                    </div>
                </ReactRedux.Provider>
            </div>);
    }
}

export { App };
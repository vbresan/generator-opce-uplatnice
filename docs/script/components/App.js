import { Uplatnica } from 'Uplatnica';
import { LoadDialog } from 'LoadDialog';
import { SaveDialog } from 'SaveDialog';
import { Disclaimer } from 'Disclaimer';
import { About } from 'About';
import { Forma } from 'Forma';
import { FormatCurrency } from 'Format';

const _defaultState = {
    naziv_naloga: '',
    nalog: {
        platitelj__ime: '',
        platitelj__adresa: '',
        platitelj__postanskiBroj: '',
        platitelj__gradMjesto: '',
        primatelj__ime: '',
        primatelj__adresa: '',
        primatelj__postanskiBroj: '',
        primatelj__gradMjesto: '',
        primatelj__iban: '',
        iznos: '',
        primatelj__model: '',
        primatelj__pozivNaBroj: '',
        sifra__namjene: '',
        opis_placanja: ''
    }
};

class App extends React.Component {

    constructor(props) {
        super(props);

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleNalogLoad = this.handleNalogLoad.bind(this);
        this.handleFormAction = this.handleFormAction.bind(this);
        this.handleNazivChange = this.handleNazivChange.bind(this);

        BarcodePayment.Init({
            ValidateIBAN: false, // Validation is not yet implemented
            ValidateModelPozivNaBroj: true // Validation is not yet implemented
        });

        this.state = _defaultState;
    }

    handleNazivChange(value) {
        this.setState({
            naziv_naloga: value
        });
    }

    handleNalogLoad(nalogData) {
        this.setState(nalogData);
    }

    handleUserInput(inputId, inputValue) {
        const nalog = this.state.nalog;

        nalog[inputId] = inputValue;

        this.setState({ nalog: nalog });
    }

    handleFormAction(action) {
        switch(action) {
            case 'novi-nalog':
                this.setState(_defaultState);
                break;
            case 'print':
                window.print();
                break;
        }
    }

    getPaymentParams() {
        const paymentParams = new BarcodePayment.PaymentParams(),
              nalog = this.state.nalog;
        
        paymentParams.Iznos =  FormatCurrency(nalog.iznos);
        paymentParams.ImePlatitelja = nalog.platitelj__ime;
        paymentParams.AdresaPlatitelja = nalog.platitelj__adresa;
        paymentParams.SjedistePlatitelja = (nalog.platitelj__postanskiBroj + ' ' + nalog.platitelj__gradMjesto).trim();
        paymentParams.Primatelj = nalog.primatelj__ime;
        paymentParams.AdresaPrimatelja = nalog.primatelj__adresa;
        paymentParams.SjedistePrimatelja = (nalog.primatelj__postanskiBroj + ' ' + nalog.primatelj__gradMjesto).trim();
        paymentParams.IBAN = nalog.primatelj__iban;
        paymentParams.ModelPlacanja = nalog.primatelj__model;
        paymentParams.PozivNaBroj = nalog.primatelj__pozivNaBroj;
        paymentParams.SifraNamjene = nalog.sifra__namjene;
        // opis plaćanja automatski skraćujem na dopušteni broj znakova
        paymentParams.OpisPlacanja = nalog.opis_placanja.substr(0, BarcodePayment.MaxLengths.Description).replace(/\n/g," ");
        
        return paymentParams;
    }

    validateParams(paymentParams) {

        const resultCode = BarcodePayment.ValidatePaymentParams(paymentParams);
        const resultEnum = BarcodePayment.ValidationResult;

        return({
            resultCode: resultCode,
            platitelj__ime: (resultCode & resultEnum.PayerNameInvalid || resultCode & resultEnum.PayerNameMaxLengthExceeded),
            platitelj__adresa: (resultCode & resultEnum.PayerAddressInvalid || resultCode & resultEnum.PayerAddressMaxLengthExceeded),
            platitelj__postanskiBroj: (resultCode & resultEnum.PayerHQInvalid || resultCode & resultEnum.PayerHQMaxLengthExceeded),
            platitelj__gradMjesto: (resultCode & resultEnum.PayerHQInvalid || resultCode & resultEnum.PayerHQMaxLengthExceeded),
            primatelj__ime: (resultCode & resultEnum.ReceiverNameInvalid || resultCode & resultEnum.ReceiverNameMaxLengthExceeded),
            primatelj__adresa: (resultCode & resultEnum.ReceiverAddressInvalid || resultCode & resultEnum.ReceiverAddressMaxLengthExceeded),
            primatelj__postanskiBroj: (resultCode & resultEnum.ReceiverHQInvalid || resultCode & resultEnum.ReceiverHQMaxLengthExceeded),
            primatelj__gradMjesto: (resultCode & resultEnum.ReceiverHQInvalid || resultCode & resultEnum.ReceiverHQMaxLengthExceeded),
            primatelj__iban: (resultCode & resultEnum.IBANInvalid || resultCode & resultEnum.IBANMaxLengthExceeded),
            iznos: (resultCode & resultEnum.PricePatternInvalid || resultCode & resultEnum.PriceMaxLengthExceeded),
            primatelj__model: (resultCode & resultEnum.PaymentModelInvalid || resultCode & resultEnum.PaymentModelMaxLengthExceeded),
            primatelj__pozivNaBroj: (resultCode & resultEnum.CalloutNumberInvalid || resultCode & resultEnum.CalloutNumberMaxLengthExceeded),
            sifra__namjene: (resultCode & resultEnum.IntentCodeInvalid || resultCode & resultEnum.IntentCodeMaxLengthExceeded),
            opis_placanja: (resultCode & resultEnum.DescriptionInvalid || resultCode & resultEnum.DescriptionMaxLengthExceeded)
        });
    }

    render() {
        const nalog=this.state.nalog,
              paymentParams = this.getPaymentParams(),
              validation = this.validateParams(paymentParams),
              encodedText = BarcodePayment.GetEncodedText(paymentParams);

        return(
            <div>
                <About />
                <LoadDialog onNalogLoad={this.handleNalogLoad} />
                <SaveDialog {...this.state} onNazivChange={this.handleNazivChange} />
                <Forma onAction={this.handleFormAction} onUserInput={this.handleUserInput} nalog={nalog} validation={validation} encodedText={encodedText} />
                <Disclaimer />
            </div>);
    }
}

export { App };
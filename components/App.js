var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'HnHsxCYCYLXvRLNtw6tZpoRiH7OYR830';


App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {  // 1.Pobiera tekst
        this.setState({
          loading: true  // 2.Sygnalizacja procesu ladownia
        });
        this.getGif(searchingText, function(gif) {  // 3.Pobieranie gifa
          this.setState({  // 4. Zakonczenie pobierania:
            loading: false,  // przestaje wskazywac pobieranie
            gif: gif,  // podmienia na nowy gif 
            searchingText: searchingText  // c.ustaw nowy stan dla wyszukiwanego tekstu
          });
        }.bind(this));
    },

    getGif: function(searchingText, callback) {  // 1.Na wejście funkcja przyjmuje dwa parametry: wpisany tekst i funkcję, która ma się wykonać po pobranu gifa
        var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2.Konstruujemy adres URL dla API Giphy
        var xhr = new XMLHttpRequest();  // 3.Wywołujemy całą sekwencję tworzenia zapytania XHR do serwera i wysyłamy je
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status === 200) {
               var data = JSON.parse(xhr.responseText).data; // 4.W obiekcie odpowiedzi mamy obiekt z danymi, Rozpakowujemy do zmiennej data
                var gif = {  // 5.Układamy obiekt gif na podstawie tego, co otrzymaliśmy z serwera
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                };
                callback(gif);  // 6.Przekazujemy obiekt do funkcji callback, którą przekazaliśmy jako drugi parametr metody getGif
            }
        };
        xhr.send();
    },

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
            <div style={styles}>
                    <h1>Wyszukiwarka GIFów</h1>
                    <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                    <Search onSearch={this.handleSearch}/>
                <Gif 
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        );
    }
});
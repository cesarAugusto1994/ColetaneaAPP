import client from './axios';

const fetchPlayers = () => {
    return client(
        {
            url: 'midias',
            method: 'GET',
        }
    );
};

export default {
    fetchPlayers,
};

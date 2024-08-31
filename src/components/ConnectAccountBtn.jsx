export default function ConnectAccountBtn({ connectAccount }) {
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
                onClick={connectAccount}
                style={{
                    padding: '12px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                }}
            >
                Connect Wallet
            </button>
        </div>
    );
}

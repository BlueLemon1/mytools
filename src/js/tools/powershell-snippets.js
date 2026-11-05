const SNIPPETS = {
    rest: (o) => [
        '$Headers = @{',
        "    Authorization = 'Bearer ' + " + (o.tokenVariable || '$accessToken'),
        "    Accept = 'application/json'",
        '}',
        '',
        '$Response = Invoke-RestMethod -Method Get -Uri ' + "'" + (o.uri || 'https://api.example.com/v1/items') + "'" + ' -Headers $Headers',
        '$Response | ConvertTo-Json -Depth 20',
    ].join('\n'),
    post: (o) => [
        '$Body = @{',
        "    name = 'Example'",
        '    active = $true',
        '} | ConvertTo-Json -Depth 10',
        '',
        '$Headers = @{',
        "    Authorization = 'Bearer ' + $accessToken",
        "    'Content-Type' = 'application/json'",
        '}',
        '',
        'Invoke-RestMethod -Method Post -Uri ' + "'" + (o.uri || 'https://api.example.com/v1/items') + "'" + ' -Headers $Headers -Body $Body',
    ].join('\n'),
    ad: () => [
        'Import-Module ActiveDirectory',
        '',
        "$Users = Get-ADUser -Filter * -SearchBase 'OU=Users,DC=example,DC=local' -Properties Enabled, Mail, WhenCreated",
        '$Users | Select-Object Name, SamAccountName, Enabled, Mail, WhenCreated',
    ].join('\n'),
    csv: () => [
        "$InputPath = '.\\input.csv'",
        "$OutputPath = '.\\output.csv'",
        '',
        "$Data = Import-Csv -Path $InputPath -Delimiter ';'",
        "$Data | Where-Object { $_.Status -eq 'Active' } | Export-Csv -Path $OutputPath -Delimiter ';' -NoTypeInformation -Encoding UTF8",
    ].join('\n'),
    json: () => [
        "$Json = Get-Content -Path '.\\data.json' -Raw -Encoding UTF8",
        '$Data = $Json | ConvertFrom-Json',
        '',
        '$Data | ConvertTo-Json -Depth 20',
    ].join('\n'),
    trycatch: () => [
        'try {',
        "    $Result = Invoke-RestMethod -Uri 'https://api.example.com' -ErrorAction Stop",
        '    # Continue processing',
        '}',
        'catch {',
        "    Write-Error ('Request failed: ' + $_.Exception.Message)",
        '    throw',
        '}',
    ].join('\n'),
    logging: () => [
        "$LogPath = '.\\script.log'",
        '',
        'function Write-Log {',
        '    param(',
        '        [Parameter(Mandatory)] [string] $Message,
        "        [ValidateSet('INFO', 'WARN', 'ERROR')] [string] $Level = 'INFO'",
        '    )',
        "    $Line = '{0} [{1}] {2}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Level, $Message",
        '    Add-Content -Path $LogPath -Value $Line -Encoding UTF8',
        '    Write-Output $Line',
        '}',
        '',
        "Write-Log -Message 'Script started'",
    ].join('\n'),
    graph: () => [
        "Connect-MgGraph -Scopes 'User.Read.All'",
        '',
        '$Users = Get-MgUser -All -Property Id, DisplayName, UserPrincipalName',
        '$Users | Select-Object DisplayName, UserPrincipalName',
        '',
        'Disconnect-MgGraph',
    ].join('\n'),
    exchange: () => [
        'Import-Module ExchangeOnlineManagement',
        'Connect-ExchangeOnline -ShowBanner:$false',
        '',
        'try {',
        '    # Process all required mailboxes here',
        '}',
        'finally {',
        '    Disconnect-ExchangeOnline -Confirm:$false',
        '}',
    ].join('\n'),
};

export function generatePowerShellSnippet(name, options = {}) {
    const builder = SNIPPETS[name];
    if (!builder) throw new Error('unknownSnippet');
    return builder(options);
}

export const powerShellSnippetTypes = Object.keys(SNIPPETS);
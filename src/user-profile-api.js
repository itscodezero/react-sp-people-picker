const SP_SITE_URL = window._spPageContextInfo
  ? window._spPageContextInfo.siteAbsoluteUrl
  : null
const PEOPLE_PICKER_URL =
  '/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.ClientPeoplePickerSearchUser'

export async function getUserSuggesstions(query) {
  if (!SP_SITE_URL) {
    return 'This people picker works only in SharePoint context'
  }
  const queryURL = SP_SITE_URL + PEOPLE_PICKER_URL
  try {
    const results = await postDataByRest(queryURL, query)
    return results
  } catch (error) {
    console.log(error)
    throw error
  }
}

function getFormDigest(webUrl) {
  return fetch(webUrl + "/_api/contextinfo", {
    method: "post",
    headers: { "Accept": "application/json; odata=verbose" }
  }).then(function (response) {
    return response.json().then(function (json) {
      return json;
    });
  });
}

export async function postDataByRest(restUrl, data) {
  const webUrl = window._spPageContextInfo.siteServerRelativeUrl
  return getFormDigest(webUrl).then(function (formDigestData) {
    return fetch(restUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest':
          formDigestData.d.GetContextWebInformation.FormDigestValue
      },
      credentials: 'include',
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json().then(function (json) {
        let result = []
        if (json.d.ClientPeoplePickerSearchUser) result = json
        return result
      })
    })
  })
}

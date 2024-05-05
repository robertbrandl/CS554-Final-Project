import { MongoClient } from 'mongodb';
import { Client } from '@elastic/elasticsearch';
import { mongoConfig } from "./settings.js";

let collectionName = "playlists";
const esOptions = { node: 'http://localhost:9200' };
let indexName = "playlist_ind";
let followedIndex = "followedPlaylist_ind";
async function synchronizeData() {
    try {
      // Connect to MongoDB
      const mongoClient = new MongoClient(mongoConfig.serverUrl);
      await mongoClient.connect();
      const db = mongoClient.db(mongoConfig.database);
      const collection = db.collection(collectionName);
  
      // Connect to Elasticsearch
      const esClient = new Client(esOptions);
  
      // Retrieve data from MongoDB
      const documents = await collection.find().toArray();
  
      // Transform and index data into Elasticsearch
      await Promise.all(documents.map(async (doc) => {
        const { _id, ...body } = doc;
        console.log(doc._id.toString())
        await esClient.index({
          index: indexName,
          id: doc._id.toString(),
          body: body 
        });
      }));
  
      console.log('Data synchronized successfully!');
    } catch (error) {
      console.error('Error synchronizing data:', error);
    }
  }
async function indexArray(array) {
    try {
        const esClient = new Client(esOptions);
        // Iterate over each object in the array
        await Promise.all(array.map(async (obj) => {
            // Index the object into Elasticsearch
            await esClient.index({
                index: followedIndex,
                body: obj
            });
        }));

        console.log('Array indexed successfully into Elasticsearch!');
    } catch (error) {
        console.error('Error indexing array into Elasticsearch:', error);
    }
}
async function printAllData() {
    try {
      const esClient = new Client(esOptions);
  
      const response = await esClient.search({
        index: indexName,
        body: {
          query: { match_all: {} }, 
          size: 10000 // Increase the size to retrieve all documents (up to 10000 by default)
        }
      });
      console.log('All documents stored in Elasticsearch:');
      response.hits.hits.forEach((hit, index) => {
        console.log(`Document ${index + 1}:`, hit._source);
      });
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }
async function searchData(query) {
    try {
      const esClient = new Client(esOptions);
  
      const response = await esClient.search({
        index: indexName,
        body: {
            query: {
              wildcard: {
                title: `*${query}*`
              }
            }
          }
      });
  
      return response.hits.hits;
    } catch (error) {
      console.error('Error searching data:', error);
    }
  }
async function searchFollowed(query) {
    try {
      const esClient = new Client(esOptions);
  
      const response = await esClient.search({
        index: followedIndex,
        body: {
            query: {
              wildcard: {
                title: `*${query}*`
              }
            }
          }
      });
  
      return response.hits.hits;
    } catch (error) {
      console.error('Error searching data:', error);
    }
  }
export { synchronizeData, printAllData, searchData, indexArray, searchFollowed };